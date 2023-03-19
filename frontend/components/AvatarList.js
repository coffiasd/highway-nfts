import Avatar, { genConfig } from "react-nice-avatar";

export default function AvatarList() {
    const config = genConfig();
    return (
        <>
            <Avatar style={{ width: "10rem", height: "10rem" }} {...config} />
        </>
    );
}