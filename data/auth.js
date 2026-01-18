let users = [
  {
    // abc123: $2b$12$DwdkLNqPoKd2BfR3h4snIuDdNN6WNQ8WOWuE5eadSnclUB.OOVAse
    id: "1", // 사용자의 고유한 아이디 -> DB에서 자동 생성 -> request에서 보내지X
    username: "ellie", // 사용자 닉네임 (아이디)
    password: `$2b$12$DwdkLNqPoKd2BfR3h4snIuDdNN6WNQ8WOWuE5eadSnclUB.OOVAse`, // 사용자 비번
    name: "Ellie", // 사용자 이름
    email: "ellie@server.com", // 사용자 이메일
    url: "", // 사용자 프로파일 사진 URL
  },
];

export async function findByUsername(username) {
  return users.find((user) => user.username === username);
}

export async function findById(id) {
  console.log("id:" + id);

  return users.find((user) => user.id === id);
}

export async function createUser(user) {
  const created = { ...user, id: Date.now().toString() }; // ...user 쓰면 다 저장됨
  //   const newUser = {
  //     username: user.username,
  //     password: user.password,
  //     name: user.name,
  //     email: user.email,
  //     url: user.url,
  //   };
  users.push(created);
  return created.id;
}

export async function getAllUsers() {
  return users;
}
