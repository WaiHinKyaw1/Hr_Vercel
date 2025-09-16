export type CreateAttendanceAPIReq = {
    device_info?: string;
    type: "check_in" | "check_out";
    latitude: number;
    longitude: number;
};

export type UpdateAttendanceAPIReq = {
    device_info?: string;
    type: "check_in" | "check_out";
    latitude: number;
    longitude: number;
};