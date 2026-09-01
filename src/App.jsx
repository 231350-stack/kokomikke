import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import TabBar from './components/TabBar'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import Encyclopedia from './pages/Encyclopedia'
import Profile from './pages/Profile'
import CameraPage from './pages/CameraPage'
import PreviewPage from './pages/PreviewPage'
import PostPage from './pages/PostPage'
import SavedPage from './pages/SavedPage'
import SearchPage from './pages/SearchPage'
import SearchResultsPage from './pages/SearchResultsPage'
import PlaceDetailPage from './pages/PlaceDetailPage'
import DirectionsPage from './pages/DirectionsPage'

/** タブバーあり（メイン画面） */
function MainLayout() {
  return (
    <div className="flex justify-center min-h-screen" style={{ backgroundColor: '#f0f0ec' }}>
      <div
        className="relative w-full bg-white overflow-hidden flex flex-col"
        style={{ maxWidth: '430px', minHeight: '100dvh' }}
      >
        <main className="flex-1 overflow-y-auto pb-[calc(60px+env(safe-area-inset-bottom))]">
          <Outlet />
        </main>
        <TabBar />
      </div>
    </div>
  )
}

/** タブバーなし・最大幅あり（カメラフロー画面） */
function CameraFlowLayout() {
  return (
    <div className="flex justify-center min-h-screen" style={{ backgroundColor: '#f0f0ec' }}>
      <div
        className="w-full flex flex-col"
        style={{ maxWidth: '430px', minHeight: '100dvh', backgroundColor: '#f0f0ec' }}
      >
        <Outlet />
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 全画面カメラ（fixed、タブバーなし） */}
        <Route path="/camera" element={<CameraPage />} />

        {/* カメラフロー・検索（タブバーなし、max-width制約あり） */}
        <Route element={<CameraFlowLayout />}>
          <Route path="/post" element={<PostPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/place-detail" element={<PlaceDetailPage />} />
          <Route path="/directions" element={<DirectionsPage />} />
        </Route>

        {/* メインレイアウト（タブバーあり） */}
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/map" element={<Navigate to="/home" replace />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/encyclopedia" element={<Encyclopedia />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
