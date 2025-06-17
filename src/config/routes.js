import Home from '@/components/pages/Home'

export const routes = {
  home: {
    id: 'home',
    label: 'Upload Files',
    path: '/',
    icon: 'Upload',
    component: Home
  }
}

export const routeArray = Object.values(routes)