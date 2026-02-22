import { useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useTrip } from '../context/TripContext'
import { Trash2, GripVertical, RefreshCw, Check } from 'lucide-react'
import { generateItinerary } from '../api'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function Customize() {
  const { itinerary, reorderStops, removeStop, setItinerary, setMeta, tripRequest } = useTrip()
  const [regen, setRegen] = useState(false)
  const nav = useNavigate()

  const onDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(itinerary)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    reorderStops(items)
  }

  const handleRegen = async () => {
    if (!tripRequest) return toast.error('No trip request found')
    setRegen(true)
    try {
      const res = await generateItinerary(tripRequest)
      setItinerary(res.data.itinerary)
      setMeta(res.data.meta)
      toast.success('Fresh itinerary generated!')
    } catch (e) {
      toast.error('Regeneration failed')
    } finally { setRegen(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">✏️ Customize Itinerary</h1>
        <div className="flex gap-3">
          <button onClick={handleRegen} disabled={regen}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
          >
            <RefreshCw size={15} className={regen ? 'animate-spin' : ''} /> Re-generate
          </button>
          <button onClick={() => nav('/itinerary')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            <Check size={15} /> Done
          </button>
        </div>
      </div>
      <p className="text-slate-400 text-sm mb-6">🔀 Drag to reorder • 🗑️ Tap trash to remove a stop</p>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="itinerary">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {itinerary.map((stop, index) => (
                <Draggable key={`${stop.day}-${stop.time}-${stop.place_name}`}
                  draggableId={`${stop.day}-${stop.time}-${stop.place_name}`} index={index}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}
                      className={`bg-slate-800 border rounded-xl p-4 flex items-center gap-3 ${
                        snapshot.isDragging ? 'border-blue-500 shadow-lg' : 'border-slate-700'
                      }`}
                    >
                      <span {...provided.dragHandleProps} className="text-slate-500 cursor-grab">
                        <GripVertical size={18} />
                      </span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{stop.place_name}</p>
                        <p className="text-slate-500 text-xs">Day {stop.day} • {stop.time} • {stop.duration_hrs}hr • {stop.category}</p>
                      </div>
                      <button onClick={() => removeStop(stop.day, stop.time)}
                        className="text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
