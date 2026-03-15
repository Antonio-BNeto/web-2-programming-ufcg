export default function LoadingSpinner({ size = 8 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center w-full py-12">
      <div
        className={`w-${size} h-${size} border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin`}
      />
    </div>
  );
}
