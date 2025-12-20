import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  return <h2>Product ID: {id}</h2>;
}
