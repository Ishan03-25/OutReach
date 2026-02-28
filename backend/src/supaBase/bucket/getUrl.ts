import { supabase } from "../client";

export const getPublicUrl = (filePath: string): string => {
    const {data} = supabase.storage.from('cvs').getPublicUrl(filePath);
    return data.publicUrl;
}
