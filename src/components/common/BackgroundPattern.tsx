export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C7E4E]/5 via-transparent to-[#047BCA]/5"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23047BCA' fill-opacity='0.03'%3E%3Cpath d='M50 0L100 50L50 100L0 50z'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-[#1C7E4E]/10 to-[#047BCA]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-[#047BCA]/10 to-[#1C7E4E]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}
