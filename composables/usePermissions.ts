import { useMyAuthStore } from '~/store/Auth'

export const usePermissions = () => {
  const authStore = useMyAuthStore()

  const hasRole = (role: string | string[]): boolean => {
    const userRoles = authStore.user?.user.roles || []
    
    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r))
    }
    return userRoles.includes(role)
  }

  const hasAllRoles = (roles: string[]): boolean => {
    const userRoles = authStore.user?.user.roles || []
    return roles.every(role => userRoles.includes(role))
  }

  const hasPermission = (permission: string | string[]): boolean => {
    const userPermissions = authStore.permissions || []
    
    if (Array.isArray(permission)) {
      return permission.some(p => userPermissions.includes(p))
    }
    return userPermissions.includes(permission)
  }

  const isSuperAdmin = computed(() => hasRole('SuperAdmin'))
  const isStaffAdmin = computed(() => hasRole('StaffAdmin'))
  const isStreamer = computed(() => hasRole('Streamer'))
  const isRegularUser = computed(() => !hasRole(['SuperAdmin', 'StaffAdmin', 'Streamer']))

  const canAccessAdminRoutes = computed(() => hasRole(['SuperAdmin', 'StaffAdmin']))
  const canAccessStreamRoutes = computed(() => hasRole(['SuperAdmin', 'StaffAdmin', 'Streamer']))

  const getRedirectPath = (): string => {
    if (hasRole('SuperAdmin') || hasRole('StaffAdmin')) {
      return '/user'
    } else if (hasRole('Streamer')) {
      return '/stream'
    } else {
      return '/me'
    }
  }

  return {
    hasRole,
    hasAllRoles,
    hasPermission,
    isSuperAdmin,
    isStaffAdmin,
    isStreamer,
    isRegularUser,
    canAccessAdminRoutes,
    canAccessStreamRoutes,
    getRedirectPath
  }
} 