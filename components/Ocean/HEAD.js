import { Button } from "reactstrap";
import { useRouter } from 'next/router';

const HEAD = ({ REF }) => {
    const router = useRouter();
    return(
    <div>
        <h2>{REF}</h2>
        <Button className="mr-2" size="sm" color="primary" style={{borderRadius: 0}}><i className="fa fa-share"></i> Share</Button>
        <Button className="mr-2" size="sm" color="primary" style={{borderRadius: 0}}><i className="fa fa-share"></i> Edit</Button>
        <Button className="mr-2" size="sm" color="danger" style={{borderRadius: 0}} onClick={()=>router.back()}><i className="fa fa-reply"></i> Back</Button>
        <hr />
    </div>
)}
export default HEAD;