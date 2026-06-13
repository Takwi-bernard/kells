
import { createClient }
from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL =
"https://tkkkkilrbrjusscvruzp.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_yLYgeftrIuCN8eaoAQtZzA__nm3Xlft";

export const supabase =
createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);





