import {SessionProvider} from "next-auth/react";

export const AppContext = ({children}) => {
    return <SessionProvider>{children}</SessionProvider>
}
