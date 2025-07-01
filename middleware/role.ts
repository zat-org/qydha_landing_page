import { useMyAuthStore } from '~/store/Auth';

interface RouteMetaWithRole {
  requiredRoles?: string[]
  requiredPermissions?: string[]
  allowMultipleRoles?: boolean
}

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useMyAuthStore()
  
  // Ensure user is logged in
  if (!authStore.logedin) {
    return navigateTo('/login')
  }

  const userRoles = authStore.user?.user.roles || []
  const meta = to.meta as RouteMetaWithRole

  // If no specific role requirements, allow access
  if (!meta.requiredRoles && !meta.requiredPermissions) {
    return
  }

  // Super Admin bypasses all role checks
  if (userRoles.includes('SuperAdmin')) {
    return
  }

  // Check required roles
  if (meta.requiredRoles) {
    const hasRequiredRole = meta.allowMultipleRoles 
      ? meta.requiredRoles.every(role => userRoles.includes(role))
      : meta.requiredRoles.some(role => userRoles.includes(role))

    if (!hasRequiredRole) {
      // Redirect based on user's highest role
      if (userRoles.includes('StaffAdmin')) {
        return navigateTo('/user')
      } else if (userRoles.includes('Streamer')) {
        return navigateTo('/stream')
      } else {
        return navigateTo('/me')
      }
    }
  }

  // Check specific permissions (if you implement permission-based access)
  if (meta.requiredPermissions) {
    const userPermissions = authStore.permissions || []
    const hasRequiredPermission = meta.requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    )

    if (!hasRequiredPermission) {
      return navigateTo('/unauthorized')
    }
  }
}) 