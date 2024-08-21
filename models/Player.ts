export enum stateStatus{
    "مقبول بفريق"=1,
    "مقبول بدون  بفريق",
    "تحت الانتظار لاكمال البيانات",
    "مرفوض",
}
export  enum PlayerState
{
    Approved=1,
    Pending,
    Rejected,
}
export interface State{
    id:string
    name:string ;
    phone:string ;
    email:string;
    comment:string;
    key:string
    state:PlayerState 
    teamId:string|null
}

