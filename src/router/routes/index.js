import AuthRoutes from './AuthRoutes'
import DevicesEditRoutes from './DevicesEditRoutes'
import DevicesRoutes from './DevicesRoutes'
import LiveRoutes from './LiveRoutes'
import PermissionsRoutes from './PermissionsRoutes'
import SettingsRoutes from './SettingsRoutes'
import SitesRoutes from './SitesRoutes'
import TeamsRoutes from './TeamsRoutes'

export default [
  ...AuthRoutes,
  ...DevicesEditRoutes,
  ...DevicesRoutes,
  ...LiveRoutes,
  ...PermissionsRoutes,
  ...SettingsRoutes,
  ...SitesRoutes,
  ...TeamsRoutes
]
