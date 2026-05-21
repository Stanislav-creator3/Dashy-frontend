export function BlockSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="animate-pulse h-15 w-full bg-gray-800 rounded-xl mb-2"></div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse h-25 w-full bg-gray-800 rounded-xl mb-1"
        ></div>
      ))}
    </div>
  );
}
