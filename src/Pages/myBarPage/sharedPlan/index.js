import React, { useEffect, useState } from 'react';
import * as Styles from './style';
import MyPage from '../../myPage'; 
import { MarginTopWrapper } from "../../../Common/style";
import Paging from '../../../Components/paging';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const SharedPlan = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState();
  useEffect(() => {
    getUserPlan(); 
},[]);

  const getUserPlan = async () => { // DB에 있는 플랜데이터 
    const data = await axios.get('http://localhost:8080/getShareMyPlan');
    if(!data){
        getUserPlan();
    }else{
      console.log(data.data.data);
      setPlan(Object.entries(data.data.data));
    }
  }
  const onShareBtn = async () => {
    try{
        await axios.put('http://localhost:8080/getDeleteShareMyPlan', {id: location.search.split("=")[1]})
        getUserPlanById(location.search.split("=")[1]);
    }catch(e){
        alert("공유 버튼 에러");
        console.log(e);
    }
}
  const infoMove = (e) => {
    navigate('/calendar', {state : plan})
  }
  return (
    
    < >
      <MyPage sharedPlanAction ="sharedPlan"/>
      <MarginTopWrapper>
        <Styles.BigBox>
          <Styles.Box>
            <Styles.Text>공유한 플랜</Styles.Text>
          </Styles.Box>
          {plan === undefined ? "" : (plan.map((el, idx) => {
            return(
          <Styles.SmallBox key={idx}>
            <Styles.LineBox>
              <Styles.ImgBox src={`assets/image32.png`}/>
              <Styles.ContentBox>
                <Styles.ContentBox2>
                  <Styles.ContentBox3>
                    <Styles.ContentText>{el[1].title}</Styles.ContentText>
                    <Styles.DayBox>{el[1].date}</Styles.DayBox>
                  </Styles.ContentBox3>
                  <Styles.ModifyDeleteBox open={el[1].type} onClick={onShareBtn}>공유 삭제</Styles.ModifyDeleteBox>
                </Styles.ContentBox2>
                <Styles.ContentBox2>
                  {/* <Styles.Imgheart>
                  </Styles.Imgheart>
                  <Styles.HeartSumText>300</Styles.HeartSumText> */}
                  <Styles.NameBox>{el[1].name}</Styles.NameBox>
                </Styles.ContentBox2>
              </Styles.ContentBox>
            </Styles.LineBox>
          </Styles.SmallBox>
            )
          }))}
          {/* <Paging page={page} count={totalItemsCount} setPage={setPage} itemsCount={itemsCount}/> */}
        </Styles.BigBox>
      </MarginTopWrapper>
      
    </>
  );
};
  
export default SharedPlan;