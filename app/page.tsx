import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export default async function Home() {

  async function createPost(formData: FormData){
    "use server";
   
    
   const title = formData.get('title') as string;
   const body = formData.get('body') as string;

   const post = await db.post.create({
    data: {
      title: title ,
      body: body ,  
    },
   });

   revalidatePath('/');
   return post;
  }

  const postData = await db.post.findMany()
  console.log(postData);

  async function updatePost(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;

    const post = await db.post.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        body: body,
      }
    });

    revalidatePath('/');
    return post;
  }

  async function destroyPost(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;

    const post = await db.post.delete ({
      where: {
        id: id,
      },
    });

    revalidatePath('/');
    return post;
  }
  

  return (
    <div className="max-w-2xl mx-auto">

      <Card>
        <CardHeader>
          <CardTitle>CRUD</CardTitle>
          <CardDescription>Create propertity</CardDescription>
        </CardHeader>
        <CardContent>
        <form action={createPost}>

          <Input name="title" className="mb-3" placeholder="title"/>
          <Input name="body" className="mb-3" placeholder="body text"/>

          <Button className="w-full">Save</Button>

        </form>
        </CardContent>
      </Card>

      

      <div className="mt-10">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          All Post
        </h2>
          {postData.map((post) => (
            <div className="mb-2">
              <Card>
                <form action={updatePost}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{post.body}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Input name="id" type="hidden" value={post.id} className="mb-3" placeholder="title"/>
                    <Input name="title" defaultValue={post.title} className="mb-3" placeholder="title"/>
                    <Input name="body" defaultValue={post.body} className="mb-3" placeholder="body text"/>
                  </CardContent>
                  
                  <CardFooter>
                    <Button className="w-full">Update</Button>
                  </CardFooter>
                </form>

                  
                <form action={destroyPost}>
                  <CardContent>
                    <Input name="id" type="hidden" value={post.id}/>
                    <Button variant="destructive" className="w-full">Delete</Button>
                  </CardContent>
                </form>
                  
              </Card>
              
            </div>
          ))}        
      </div>

    </div>
  );
}
