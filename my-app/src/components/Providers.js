/**
 * The topmost provider component that wraps the entire app.
 * It provides the SessionContext and the AppContext to the app.
 * The SessionContext is used by NextAuth to manage user sessions.
 * The AppContext is used to share app-wide state between components.
 * The `session` prop is set to `null` to prevent the app from
 * attempting to restore a user session on each page load.
 * This is useful for apps that don't need user authentication.
 */
export default function Providers({ children }) {
  return (
    <SessionProvider session={null}>
      <AppProvider>
        {children}
      </AppProvider>
    </SessionProvider>
  )
} 