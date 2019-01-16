let postId = 1;

const posts =[
    {
        id:1,
        title:'제목',
        body:'내용'
    }
];


/**
 * 포스트작성
 */
exports.write = (req,res,next) => {
    const {
        title,
        body
    } = req.request.body;

    postId += 1;

    const post = {id:postId, title,body}
    posts.push(post);

    res.body = post;    
}
 

/**
 * 포스트목록조회
 * 
 */
exports.list = (req,res,next)=>{
    req.body = posts;
}


/**
 * 특정포스트조회
 */
exports.read = (req,res,next) => {
    const {id} = req.params;

    const post = posts.find(p => p.id.toString() === id);

    if(!post){
        res.status = 404;
        res.body = {
            message:'포스트가 존재하지 않습니다.'
        };
        return;
    }
    res.body = post;
} 


/**
 * 특정 포스트제거
 */
exports.remove = (req,res,next) => {
    const {id} = req.params;

    //해당 id 값을 가진 post가 몇 번째인지 확인합니다.
    const index = posts.findIndex( p => p.id.toString() === id);
    
    if(index === -1){
        res.status = 404;
        res.body = {
            message:'포스트가 존재하지 않습니다.'
        }
        return;    
    }

    //index번쨰 아이템을 제거합니다.
    posts.splice(index,1);
    res.status = 204;
}


/**
 * 포스트 수정(교체)
 */
exports.replace = (req, res, next) => {
    const {id} = req.params;
    //해당 id 값을 가진 post가 몇 번째인지 확인합니다.
    const index = posts.findIndex(p => p.id.toString === id);
    if(index === -1){
        res.status=404;
        res.body={
            message:'포스트가 존재하지 않습니다.'
        }
        return
    }

    posts[index] = {
        id,
        ...req.request.body
    };
    res.body = posts[index]
}


/**
 * 포스트수정(특정 필드 변경)
 */
exports.update = (req,res,next) => {
    const {id} = req.params;

    const index = posts.findIndex(p => p.id.toString() === id);

    if(index === -1){
        res.status = 404;
        res.body = {
            message:'포스트가 존재하지않습니다.'
        }
        return
    }

    posts[index]={
        ...posts[index],
        ...req.request.body
    };
    res.body = posts[index];
}