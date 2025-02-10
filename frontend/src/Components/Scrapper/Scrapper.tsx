import axios from 'axios'
import  { useState } from 'react'

function Scrapper() {

    const [data, setData] = useState<string | any>()
    const [buttonName, setButtonname] = useState("Scrape")
    const [dataType, setDataType]= useState<string>()

    const scape = async(e:any) =>{
        e.preventDefault()
        const url = e.target.url.value
        if (url && dataType) {
            setButtonname("Scrapping...")
            const data = await axios.get(`https://scrappingbackend.vercel.app/scrapper?url=${url}&type=${dataType}`)
            const responce = data.data
            setButtonname("Scrape")
            setData(responce)
            console.log(responce);
        }
        else{
            alert("Give me al the data please")
        }
        

    }
  return (
    <div className='w-[100%]'>
        <form className='flex flex-row gap-2 justify-evenly w-[100%] ' onSubmit={(e)=>scape(e)}>
            <input className='border border-black text-xl p-[10px] w-[35%] rounded-md' type="text" name="url" id="" placeholder='URL' />
            <select 
                className="w-[35%] border tyext-xl p-[10px] p-2 rounded mb-3"
                value={dataType} 
                onChange={(e) => setDataType(e.target.value)}
            >
                <option value="">Choose one</option>
                <option value="title">Page Title</option>
                <option value="meta_description">Meta Description</option>
                <option value="h1">First H1 Tag</option>
                <option value="h2">All H2 Tags</option>
                <option value="paragraphs">All Paragraphs</option>
                <option value="links">Links</option>
            </select>
            <input className='text-xl p-[5px] rounded-md bg-black w-[30%] text-white' type="submit" value={buttonName} />
        </form>
        <div className='pt-[50px]'>
            <ol>
                {
                data?.scrapedData !== "" ? data?.scrapedData?.map((item:string, index:number)=>(
                   <li className='text-left' key={index}> {index+1}) {item}</li> 
                ))
                : <li>No Data</li>
                }
            </ol>
        </div>
    </div>
  )
}

export default Scrapper