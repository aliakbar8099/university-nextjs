import { useEffect, useState } from "react";
import OrderList from "./OrderList";
import OrderTable from "./OrderTable";
import { performGet } from "@/services/Instance/fetch.service";

function ListItem({ path = "", change = new Date() || undefined, haedItem = [] }) {
    const [listItam, setListItem] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        performGet(path).then(res => {
            setListItem(res.responseData);
            setLoading(false)
        })
    }, [change])


    return (
        <div className="relative">
            <OrderTable haedItem={haedItem} loading={loading} listItam={listItam} />
            <OrderList haedItem={haedItem} listItam={listItam} />
        </div>
    );
}

export default ListItem;