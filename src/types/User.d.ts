type User = {
    id: number;
    name: string;
    username: string;
    user_role: "staff" | "management" | "scanner";
    position_id: number;
    gender: string;
    address: string;
    phone: string;
    email: string;
    is_active: boolean;
    dob:Date;
    start_join_date: Date;
    bank_accounts: string;
    position:{
        id: number;
        name: string; 
    }
    created_at: string | Date | null;
    updated_at: string | Date | null;
}