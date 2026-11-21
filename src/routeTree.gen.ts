import { Route } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { loginRoute } from './routes/login'
import { settingsRoute } from './routes/settings'
import { settingsIndexRoute } from './routes/settings.index'
import { settingsPanelRoute } from './routes/settings._panel'
import { settingsPanelDashboardRoute } from './routes/settings._panel.dashboard'
import { settingsPanelFilesRoute } from './routes/settings._panel.files'
import { settingsPanelStatsRoute } from './routes/settings._panel.stats'
import { settingsPanelConfigRoute } from './routes/settings._panel.config'
import { settingsPanelChangeTokenRoute } from './routes/settings._panel.change-token'
import { authRoute } from './routes/auth'
import { googleRoute } from './routes/auth/google'
import { facebookRoute } from './routes/auth/facebook'

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  settingsRoute.addChildren([
    settingsIndexRoute,
    settingsPanelRoute.addChildren([
      settingsPanelDashboardRoute,
      settingsPanelFilesRoute,
      settingsPanelStatsRoute,
      settingsPanelConfigRoute,
      settingsPanelChangeTokenRoute,
    ]),
  ]),
  authRoute.addChildren([
    googleRoute,
    facebookRoute,
  ]),
])
