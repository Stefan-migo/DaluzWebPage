interface StyleTesterLayoutProps {
  children: React.ReactNode;
}

export default function StyleTesterLayout({ children }: StyleTesterLayoutProps) {
  return (
    <div className="flex-1">
      {children}
    </div>
  );
} 