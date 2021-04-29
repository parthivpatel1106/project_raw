let selectfile;
console.log(window.XLSX);
document.getElementById("input").addEventListener("change",(event)=>{
    selectfile=event.target.files[0];
})

document.getElementById("button").addEventListener("click",()=>{
    if(selectfile){
        let fileReader=new FileReader();
        fileReader.readAsBinaryString(selectfile);
        fileReader.onload=(event)=>{
            console.log(event.target.result);
            let data =event.target.result;
            let workbook = XLSX.read(data,{type:"binary"});
            console.log(workbook);
            workbook.SheetNames.forEach(sheet=>{
                let rowObject= XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                console.log(rowObject); 
                document.getElementById("jsondata").innerHTML=JSON.stringify(rowObject,undefined,4);
                var blob= new Blob([JSON.stringify(rowObject)],{type:'application/javascript;charset=utf-8'});
                saveAs(blob,"testfile1.json")
            })
            
        }
    }
})