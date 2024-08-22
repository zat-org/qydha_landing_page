
export  enum PlayerState
{
    Approved="Approved",
    Pending ="Pending",
    Rejected="Rejected",
}
export interface State{
    player:PlayerData , 
    team:TeamData|null
}

export interface PlayerData{
    id:string ;
    name:string ;
    phone:string ;
    email:string;
    comment:string;
    state:PlayerState 
    teamId:string|null
}
export interface TeamData{
    id:string ;
    name:string ;
    state:PlayerState 
    players:PlayerData[]
}