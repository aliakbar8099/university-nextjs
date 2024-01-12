import { ChangeEvent, useEffect, useMemo, useState } from "react";
import OrderTable from "./OrderTable";
import { performDelete, performGet, performPut } from "@/services/Instance/fetch.service";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUI } from "@/context/UI";
import { WarningRounded } from "@mui/icons-material";
import { Button } from "@mui/joy";


function ListItem({ path = "", change = new Date() || undefined, haedItem = [""] }) {
    const { showModal, closeModal, showAlert } = useUI()
    const [listItam, setListItem] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingWithID, setLoadingWithID] = useState(0)
    const [routerPath, setRouerPath] = useState(location.search)
    const [isEditWidthID, setIsEditWidthID] = useState(0);
    const [editValue, setEidtValue] = useState<any>({});
    const router = useRouter()

    function setRoute(page: string = "1", search: string = "") {
        const url = `/base/semester${search ? "?" : `?page=${page || 1}&`}${page ? "" : "search=" + search}`
        setRouerPath(url)
        router.push(url)
    }

    function handleGetValue(e = { target: { name: "", value: "" } }) {
        setEidtValue({ ...editValue, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            getData(`${path}${location.search}`)
        }, 500);
    }, [change, routerPath])

    function getData(url: string) {
        performGet(url).then(res => {
            setLoading(false)
            setLoadingWithID(0)
            setListItem(res.responseData);
        })
    }

    function searchHandler(e: ChangeEvent<HTMLInputElement>) {
        setRoute("", e.target.value)
    }

    function handelDelete(id: number) {
        showModal({
            open: true,
            variant: "plain",
            color: "danger",
            titleIcon: <WarningRounded color="error" />,
            title: <small className="mt-1">آیا میخواهید آیتم مورد نظر را حذف کنید؟!</small>,
            Actions: <>
                <Button onClick={() => handleApiDelete(id)} variant="outlined" color="danger">بله</Button>
                <Button onClick={closeModal}>خیر</Button>
            </>
        })
    }

    function handleApiDelete(id: number) {
        setLoadingWithID(id)
        performDelete(`${path}/${id}`).then().then(res => {
            getData(`${path}/${location.search}`)
            showAlert('با موفقیت حذف شد', "success");
            closeModal()
        }).catch(err => console.log(err))
    }

    function handleEditSubmit() {
        setLoadingWithID(isEditWidthID)
        performPut(`${path}/${isEditWidthID}`, editValue).then(res => {
            showAlert('با موفقیت ویرایش شد', "success");
            getData(`${path}/${location.search}`)
            setIsEditWidthID(0)
            setEidtValue({})
        }).catch(err => console.log(err))
    }

    console.log(editValue);


    return (
        <div className="relative">
            <OrderTable
                haedItem={haedItem}
                loading={loading}
                listItam={listItam}
                searchHandler={searchHandler}
                handelDelete={handelDelete}
                loadingWithID={loadingWithID}
                setIsEditWidthID={setIsEditWidthID}
                isEditWidthID={isEditWidthID}
                handleEditSubmit={handleEditSubmit}
                handleGetValue={handleGetValue}
                setRoute={setRoute} />
            {/* <OrderList haedItem={haedItem} listItam={listItam} /> */}
        </div>
    );
}

export default ListItem;