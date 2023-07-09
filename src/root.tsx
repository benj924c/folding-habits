import { component$, createContextId, useContextProvider, useTask$, useStore } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import type { Session } from "@supabase/supabase-js";

import "./global.css";
import { supabase } from "./utils/supabase";

export interface IuserDetails {
  isLoggedIn: boolean
  session: Session | null
}
export const userDetailsContext = createContextId<IuserDetails>("userDetails");

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
  *
  * Don't remove the `<head>` and `<body>` elements.
  */

  const userDetails = useStore<IuserDetails>({ isLoggedIn: false, session: null })
  useContextProvider(userDetailsContext, userDetails)
  useTask$(async () => {
    const { data, error } = await supabase.auth.getSession()
    if (data.session) {
      console.log(data.session)
      userDetails.isLoggedIn = true
      userDetails.session = data.session
    }
    if (error) {
      console.error(error)
      userDetails.isLoggedIn = false
      userDetails.session = null
    }
  })

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body data-theme="dracula" lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
