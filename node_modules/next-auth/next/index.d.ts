import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { AuthOptions, Session } from "..";
import type { CallbacksOptions } from "../core/types";
declare function NextAuth(options: AuthOptions): any;
declare function NextAuth(req: NextApiRequest, res: NextApiResponse, options: AuthOptions): any;
export default NextAuth;
declare type GetServerSessionOptions = Partial<Omit<AuthOptions, "callbacks">> & {
    callbacks?: Omit<AuthOptions["callbacks"], "session"> & {
        session?: (...args: Parameters<CallbacksOptions["session"]>) => any;
    };
};
declare type GetServerSessionParams<O extends GetServerSessionOptions> = [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"], O] | [NextApiRequest, NextApiResponse, O] | [O] | [];
export declare function getServerSession<O extends GetServerSessionOptions, R = O["callbacks"] extends {
    session: (...args: any[]) => infer U;
} ? U : Session>(...args: GetServerSessionParams<O>): Promise<R | null>;
/** @deprecated renamed to `getServerSession` */
export declare function unstable_getServerSession<O extends GetServerSessionOptions, R = O["callbacks"] extends {
    session: (...args: any[]) => infer U;
} ? U : Session>(...args: GetServerSessionParams<O>): Promise<R | null>;
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXTAUTH_URL?: string;
            VERCEL?: "1";
        }
    }
}
