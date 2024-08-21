
export  enum PlayerState
{
    Approved="Approved",
    Pending ="Pending",
    Rejected="Rejected",
}
export interface State{
    id:string
    name:string ;
    phone:string ;
    email:string;
    comment:string;
    state:PlayerState 
    teamId:string|null
}

