export function makeToast(component, title, content, variant){
    component.$bvToast.toast(content,{
        title: title,
        toaster: "b-toaster-top-center",
        solid: true,
        variant: variant
    })
}

