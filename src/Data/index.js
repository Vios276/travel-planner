import axios from 'axios';

// 메인 지역 불러오는 함수
export const getAddressData = async () => {
    const data = await axios.get("https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=***00000");
    return data.data.regcodes;
}