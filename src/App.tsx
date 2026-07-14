import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppShell } from '@/components/AppShell'
import { AuthPage } from '@/pages/AuthPage'
import { FeedPage } from '@/pages/FeedPage'
import { GroupsPage, GroupDetailPage } from '@/pages/GroupsPage'
import { MessagesPage, ConversationPage } from '@/pages/MessagesPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { ProfilePage, UserProfilePage } from '@/pages/ProfilePage'
import { PostDetailPage } from '@/pages/PostDetailPage'
import { PresentationPage } from '@/pages/PresentationPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PresentationPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<AppShell />}>
            <Route path="feed" element={<FeedPage />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="groups/:slug" element={<GroupDetailPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="messages/:id" element={<ConversationPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="u/:username" element={<UserProfilePage />} />
            <Route path="post/:id" element={<PostDetailPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
