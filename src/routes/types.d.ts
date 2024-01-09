export interface RouteAction {
    name: string;
    path: string;
}

export interface RouteTypes {
    id: number;
    name: string;
    index?:boolean;
    icon?: React.ReactNode;
    path?: string;
    chids?: Route[];
}

export type RoutesWithActions = (RouteTypes & RouteAction)[];