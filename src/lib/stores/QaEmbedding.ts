import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
  runtime: 'edge'
};


export async function CollectPrompt(query: string) {

    // init supabase
    const supabaseUrl = 'https://rfpxhwugjnqvpnqhhywv.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcHhod3Vnam5xdnBucWhoeXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTE5OTkyNiwiZXhwIjoxOTk2Nzc1OTI2fQ.cjUOpZIbL0tZUGJGAERu95aceuK6OrB_97MeAzOE1OU'

    const client = createClient(supabaseUrl, supabaseAnonKey);


    // console.log(process.env.OPENAI_API_KEY)

    // vector search with query
    const vectorStore = new SupabaseVectorStore(
        new OpenAIEmbeddings(),
        {
          client,
          tableName: "qa_documents",
          queryName: "qa_match_documents",
        }
      );
    const resultForm = await vectorStore.similaritySearch(query,3)
    // console.log(resultForm)
    if (resultForm === null || resultForm.length === 0) return 'Please ignore my question or query, don\'t answer me ,and just say ' +
        '\"对不起，我不能理解您说的话。 请重新提问，问题尽量不要包含无关内容\" \nContext: 1+1=2" '

    const SEPARATOR = "\n* "
    let qalist= []
    for (let re of resultForm) {
      qalist.push( SEPARATOR + re.pageContent )
    }

    let header = ("Answer the question as truthfully as possible using the provided context, \
    and if the answer is not contained within the text below, say \"对不起，我暂时还不懂这些哦\" \nContext:")

    var prompt = header + "".concat(qalist.join())

    // console.log(prompt)

    return prompt


}

// CollectPrompt("停车场在什么地方")
