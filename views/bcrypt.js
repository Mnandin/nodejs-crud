import bcrypt from "bcryptjs"

let password = '1234'
let hash = '$2y$10$4rkbTbvSx/YSFzAKgPGwNunGlKwDkfYUDta98G4SNtrzoo7Vxu1xC'

try {
    let result = await bcrypt.compare(password, hash);
    console.log(result);
} catch (error) {
    console.error(error);
}