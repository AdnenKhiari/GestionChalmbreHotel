import { Routes,Route, Navigate, useNavigate, useParams } from "react-router-dom"

import APIROUTES from "../../constants/ApiRoutes"
import BookingsModAddModel from "./BookingsModAddModel"
import ROUTES from "../../constants/Routes"
import { useMutateQuery } from "../../lib/Queries/useMutateQuery"
import { useGetQuery } from "../../lib/Queries/useGetQuery"
import BookingsTableInfo from "../../components/BookingsTable/BookingsTableInfo"
import { format_date } from "../../lib/Utils"
const ModComponent = ()=>{

    const getInitData = (dt: any )=>{
          dt.ROOMS.forEach((roomData: any)=>{
            roomData.FOOD_CHOICE =  roomData.FOOD_CHOICE.trim()
            const new_clients =   roomData.CLIENTS.map((client : any)=>{
                client.CLIENT_DATE_OF_BIRTH = format_date(new Date(client.CLIENT_DATE_OF_BIRTH))
                return client
            }).map((client: any)=>  Object.values(client))
            roomData.CLIENTS = new_clients
        })
        console.log(dt)
        dt.NAME = dt.BOOKING_NAME
        return dt
    }

    const {id} = useParams()
    const {payload : submitResponseData,isLoading : isMutationLoading, isError: isMutationError,mutate} = useMutateQuery(APIROUTES.BOOKINGS.UPDATE(id),'PATCH',undefined,["bookings-table-info"])
    const {isError,isLoading,payload: initData} = useGetQuery(['get-booking-by-id'],APIROUTES.BOOKINGS.GETBYID(id))
        
    
    if(isError)
        return <h1 className="danger-color">Error !</h1>
    if(isLoading)
        return <p className="warning-color">Loading !</p>

    return <div className="page">
    <section className="page-header">
        <div className="section-1">
            <h1>Modify A Booking</h1>
        </div>            
    </section>
    
    <section className="page-body">
    {<BookingsModAddModel mutate={mutate} initData={getInitData(initData)}/>}
    </section>
    <section className="page-footer">
    </section>
</div>
}

const SearchComponent = ()=>{
    const navigate = useNavigate()
    const red = (row : any[])=>{
        navigate(ROUTES.BOOKING.MOD+row[0])
    }
    return <BookingsTableInfo  onRowClick={red} />
}

const BookingsMod = ()=>{
    return <Routes>
        <Route path=":id" element={<ModComponent />} />
        <Route path="" element={<SearchComponent />} />
    </Routes>
}

export default BookingsMod