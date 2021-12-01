import router from "next/router";

export default function RecentBoard({ board }) {
  return (
    <div className="cursor-pointer transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:text-indigo-800 text-2xl mb-4 tracking-tight font-extrabold text-gray-900 sm:text-2xl md:text-3xl text-center">
      {board &&
        board.map((ga) => (
          <span key={ga.ID} onClick={() => router.push(`/board/${ga.ID}`)}>
            {ga.TITLE}
          </span>
        ))}
    </div>
  );
}
