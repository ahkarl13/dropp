'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Link = {
  id: string
  title: string
  url: string
  enabled: boolean
  position: number
  type: string
}

function SortableLink({
  link,
  onToggle,
  onDelete,
  onEdit,
}: {
  link: Link
  onToggle: (id: string, enabled: boolean) => void
  onDelete: (id: string) => void
  onEdit: (link: Link) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={{ ...style, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: '1px solid #e5e5e5', borderRadius: 10, background: '#fff', marginBottom: 8, opacity: link.enabled ? 1 : 0.5 }}>
      <span {...attributes} {...listeners} style={{ cursor: 'grab', color: '#ccc', fontSize: 16, userSelect: 'none' }}>⠿</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.title}</div>
        <div style={{ fontSize: 12, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</div>
      </div>
      <button onClick={() => onToggle(link.id, !link.enabled)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e5e5', background: link.enabled ? '#f0fdf4' : '#f9f9f9', color: link.enabled ? '#166534' : '#999', cursor: 'pointer' }}>
        {link.enabled ? 'Live' : 'Off'}
      </button>
      <button onClick={() => onEdit(link)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer' }}>Edit</button>
      <button onClick={() => onDelete(link.id)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', cursor: 'pointer' }}>Del</button>
    </div>
  )
}

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [profile, setProfile] = useState<{ username: string } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Link | null>(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: p } = await supabase.from('profiles').select('username').eq('id', user.id).single()
      setProfile(p)
      const { data: l } = await supabase.from('links').select('*').eq('profile_id', user.id).order('position')
      setLinks(l || [])
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editing) {
      await supabase.from('links').update({ title, url }).eq('id', editing.id)
      setLinks(links.map(l => l.id === editing.id ? { ...l, title, url } : l))
    } else {
      const { data } = await supabase.from('links').insert({
        profile_id: user.id,
        title,
        url: url.startsWith('http') ? url : `https://${url}`,
        position: links.length,
      }).select().single()
      if (data) setLinks([...links, data])
    }

    setTitle('')
    setUrl('')
    setEditing(null)
    setShowForm(false)
    setSaving(false)
  }

  async function handleToggle(id: string, enabled: boolean) {
    await supabase.from('links').update({ enabled }).eq('id', id)
    setLinks(links.map(l => l.id === id ? { ...l, enabled } : l))
  }

  async function handleDelete(id: string) {
    await supabase.from('links').delete().eq('id', id)
    setLinks(links.filter(l => l.id !== id))
  }

  function handleEdit(link: Link) {
    setEditing(link)
    setTitle(link.title)
    setUrl(link.url)
    setShowForm(true)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = links.findIndex(l => l.id === active.id)
    const newIndex = links.findIndex(l => l.id === over.id)
    const reordered = arrayMove(links, oldIndex, newIndex)
    setLinks(reordered)
    await Promise.all(reordered.map((l, i) => supabase.from('links').update({ position: i }).eq('id', l.id)))
  }

  return (
    <div style={{ maxWidth: 560, margin: '40px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 2 }}>Your links</h1>
          {profile && (
            <a href={`/${profile.username}`} target="_blank" style={{ fontSize: 12, color: '#666' }}>
              dropp.co/{profile.username} ↗
            </a>
          )}
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setTitle(''); setUrl('') }}
          style={{ padding: '9px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
        >
          + Add link
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} style={{ padding: 16, border: '1px solid #e5e5e5', borderRadius: 10, marginBottom: 20, background: '#fafafa' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="text"
              placeholder="Title (e.g. My Portfolio)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 7, fontSize: 13 }}
            />
            <input
              type="text"
              placeholder="URL (e.g. mysite.com)"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
              style={{ padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 7, fontSize: 13 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '9px', background: '#000', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, cursor: 'pointer' }}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} style={{ padding: '9px 16px', border: '1px solid #e5e5e5', borderRadius: 7, fontSize: 13, cursor: 'pointer', background: '#fff' }}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {links.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: 40, border: '1px dashed #e5e5e5', borderRadius: 10, color: '#999', fontSize: 14 }}>
          No links yet — add your first one
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {links.map(link => (
            <SortableLink key={link.id} link={link} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
