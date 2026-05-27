interface Props {
  habitName: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteModal({ habitName, onConfirm, onCancel }: Props) {
  return (
    // Full screen dark overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      
      {/* Modal box */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Delete habit?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete <span className="font-medium text-gray-700">"{habitName}"</span>? This can't be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Yes, delete it
          </button>
        </div>
      </div>
    </div>
  )
}