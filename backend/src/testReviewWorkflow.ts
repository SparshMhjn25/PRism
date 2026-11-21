import { orchestrationWorkflow } from "./services/reviewService.js";

try{
    await orchestrationWorkflow();
    console.log("Workflow success");
}catch(err){
    console.error(err);
    throw err;
}