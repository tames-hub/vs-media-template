import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 text-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-900">404</h1>
      <p className="mb-8 text-gray-500">페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
