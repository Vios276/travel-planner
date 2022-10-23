import React, { useEffect, useState } from "react";
import * as Styles from './style';
import Paging from "../../Components/paging"
import axios from "axios";

const Comment = () => {
    const [page, setPage] = useState(1); 
    const [itemsCount] = useState(10);
    const [totalItemsCount] = useState(0);
    const [email,setEmail] = useState("");
    const [content,setContent] = useState("");
    
    // useEffect (() => {

    // })

    const writing = async () => {
        if(window.confirm("등록하시겠습니까?")){
            try{
                const data = await axios.post('http://localhost:8080/addComment',{email,content,type});
                alert(data.data.msg);
                console.log("적히나")
            }catch(e){
                alert();
            }

        }

    }

    
    return(
        <>
             <Styles.Comment>
                <Styles.Title>톡톡</Styles.Title>
                <Styles.CommentBox>
                    <Styles.ReviewBox>
                            <Styles.ReImage src="assets/myProfile.png"/>
                            <Styles.RefirstBox>
                                <Styles.ReName>{email}김지수</Styles.ReName>
                                <Styles.ReDate>2022-09-18-2023-09-18</Styles.ReDate>
                                <Styles.ReContent>아리아리일닐ㅇㄹ니ㅏ러니ㅏ러니ㅏ</Styles.ReContent>   
                            </Styles.RefirstBox>
                    </Styles.ReviewBox>
                    <Paging page={page} count={totalItemsCount} setPage={setPage} itemsCount={itemsCount}/>
                    <Styles.InputBox>
                        <Styles.ReviewTextBox>
                            <Styles.ReviewText>리뷰남기기</Styles.ReviewText>
                        </Styles.ReviewTextBox>
                        <Styles.Profile src="assets/myProfile.png"/>
                        <Styles.InputComment placeholder="댓글 입력"/>
                        <Styles.InputBtn onClick={ writing }>등록</Styles.InputBtn>
                    </Styles.InputBox>
                </Styles.CommentBox>
            </Styles.Comment>
        </>
    )
}

export default Comment;