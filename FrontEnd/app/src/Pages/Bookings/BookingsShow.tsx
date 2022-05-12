import BookingsTableInfo from "../../components/BookingsTable/BookingsTableInfo"
import { Routes,Route, Navigate, useNavigate, useParams } from "react-router-dom"
import ROUTES from "../../constants/Routes"
import { useGetQuery } from "../../lib/Queries/useGetQuery"
import APIROUTES from "../../constants/ApiRoutes"
import TableContent from "../../components/UniversalTable/TableContent"
import { ItableData } from "../../components/UniversalTable/TableSchema"
import { format_date, getRoomCapacity ,getRoomOptions,getRoomType} from "../../lib/Utils"
import moment from "moment"
const ClientsShow = ()=>{
    return <Routes>
        <Route path=":id" element={<ShowComponent />} />
        <Route path="" element={<SearchComponent />} />
    </Routes>
}

const SearchComponent = ()=>{
    const navigate = useNavigate()
    const red = (row : any[])=>{
        navigate(ROUTES.BOOKING.SHOW+row[0])
    }
    return <BookingsTableInfo  onRowClick={red} />
}

const ShowComponent = ()=>{
    const  {id } = useParams()
    const {payload : bdata,isLoading,isError,refetch} = useGetQuery(['get-booking-by-id',id],APIROUTES.BOOKINGS.GETBYID(id))
    if(isError)
        return <h1 className="danger-color">Error !</h1>
    if(isLoading)
        return <p className="warning-color">Loading !</p>
    else
        console.log(bdata)

return <div className="page">
        <section className="page-header">
            <div className="section-1">
                <h1>Booking:<span>#{bdata.BOOKING_ID}</span> </h1>
                <div className={"labelitem " + (new Date(bdata.DATE_CHECKOUT) > new Date() ? "success" : "danger") }>{new Date(bdata.DATE_CHECKOUT) > new Date() ? "ACTIVE" : "OFF"}</div>
            </div>            
            <div className="section-2">
                <p>Check IN:<span>{ format_date(bdata.DATE_CHECKIN)}</span>  </p>
                <p>Check OUT:<span>{format_date(bdata.DATE_CHECKOUT)}</span></p>
            </div>
        </section>
        <section className="page-body">
            <BookingInfo bookingData={bdata}/>
        </section>
        <section className="page-footer">
            
        </section>
    </div>
}
const BookingInfo = ({bookingData} : {bookingData : any})=>{
    return <div className="card-container">
        {bookingData && bookingData.ROOMS && bookingData.ROOMS.map((dt: any)=>{
            return <CardItem roomData={dt} />
        })}
        </div>

}

const datatable  = (body: any) : ItableData => ({
    header:["Client ID","Name","Birth Date","Age"],
    body: body
}) 
const CardItem = ({roomData} : {roomData : any})=>{
    const nav = useNavigate()
    return <div className="card-item">
        <div className="card-section-1">
            <div className="card-details">
                <div className="card-details-header">
                    <p>Room Number : </p>
                    <p>{roomData.ROOM_NUMBER}</p>
                </div>

                <div className="card-details-body">  
                    <div className="card-detail-item"> 
                        <label>Room Capacity</label>
                        <p>{getRoomCapacity(roomData.ROOM_CAPACITY)}</p>
                    </div>  
                    <div className="card-detail-item"> 
                        <label>Room Options</label>
                        <p> {getRoomOptions(roomData.ROOM_OPTION)}</p>
                    </div>  
                    <div className="card-detail-item"> 
                        <label>Room Type</label>
                        <p>{getRoomType(roomData.ROOM_TYPE)}</p>
                    </div>  
                    <div className="card-detail-item"> 
                        <label>Food Choice</label>
                        <p>{roomData.FOOD_CHOICE}</p>
                    </div>  
                    <div className="card-detail-item"> 
                        <label>Offer Name</label>
                        <p>{roomData.OFFER_NAME}</p>
                    </div> 
                    <div className="card-detail-item"> 
                        <label>Offer Price</label>
                        <p>{roomData.OFFER_PRICE}</p>
                    </div>   
                </div>
            </div>
        </div>
        <div className="card-section-seperator"></div>
        <div className="card-section-2">
            <div className="uniTable" > 
                    <TableContent  onclick={ (row : any) => nav(ROUTES.CLIENTS.SHOW+row[0])} tableData={datatable( roomData.CLIENTS.map((client : any)=>{
                        client.CLIENT_DATE_OF_BIRTH = format_date(new Date(client.CLIENT_DATE_OF_BIRTH))
                        return client
                    }).map((client: any)=>  Object.values(client)) )} />
            </div>
        </div>
    </div>
}
export default ClientsShow