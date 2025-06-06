import { UsersContainer, UsersContent, HeadText } from "./UsersStyles";
import NavigationComponent from "../../components/Navigation/NavigationComponent";

import UserTable from "../../components/Users/UserTable";


const Users = () => {
  return (
    <UsersContainer>
        <NavigationComponent />
        <UsersContent>
            <HeadText>회원관리</HeadText>
            <UserTable />
        </UsersContent>
    </UsersContainer>
  )
}

export default Users;