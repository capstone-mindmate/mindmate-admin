import { ReportContainer, ReportContent, HeadText } from "./ReportStyles";
import NavigationComponent from "../../components/Navigation/NavigationComponent";

import ReportTable from "../../components/Reports/ReportTable";


const Report = () => {
  return (
    <ReportContainer>
        <NavigationComponent />
        <ReportContent>
            <HeadText>신고관리</HeadText>
            <ReportTable />
        </ReportContent>
    </ReportContainer>
  )
}

export default Report;