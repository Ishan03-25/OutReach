import path from "path";
import { supabase } from "../client";
import fs from 'fs';

console.log(process.cwd());

async function uploadFile(){
    const resumePath = path.join(process.cwd(), "resumes", "Ishan_SDE.pdf");
    if (!fs.existsSync(resumePath)){
        console.log("Resume file not found");
        return;
    }
    const file = fs.readFileSync(resumePath);
    const {data, error} = await supabase.storage.from('cvs').upload("Ishan_SDE.pdf", file, {
        contentType: "application/pdf",
        upsert: true
    });
    if (error){
        console.log("error in uploading file: ", error);
        return;
    } else {
        console.log("File uploaded successfully: ", data);
        return;
    }
};

uploadFile();