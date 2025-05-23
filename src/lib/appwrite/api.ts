import { ID, Query } from 'appwrite'
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types'
import { account, appwriteConfig, avatars, databases, storage } from './config'

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )
    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(user.name)
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    })
    return newUser
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function saveUserToDB(user: {
  accountId: string
  email: string
  name: string
  imageUrl?: URL
  username?: string
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    )
    return newUser
  } catch (error) {
    console.log(error)
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password)
    return session
  } catch (error) {
    console.log(error)
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get()
    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )
    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current')
    return session
  } catch (error) {
    console.log(error)
  }
}

export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0])

    if (!uploadedFile) throw Error

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id)
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, '').split(',') || []

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    )

    if (!newPost) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    return newPost
  } catch (error) {
    console.log(error)
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    }
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0])

      if (!uploadedFile) throw Error

      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
    }
    // Convert tags into array
    const tags = post.tags?.replace(/ /g, '').split(',') || []

    // Create post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    )

    if (!updatedPost) {
      await deleteFile(post.imageId)
      throw Error
    }
    console.log('here but didnt upload')

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )

    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      'top',
      100
    )

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {
    console.log(error)
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)

    return { status: 'ok' }
  } catch (error) {
    console.log(error)
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(10)]
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

export async function likePost(postId: string, likeArray: string[]) {
  try {
    const updatePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likeArray,
      }
    )
    if (!updatePost) {
      throw Error
    }
    return updatePost
  } catch (error) {
    console.log(error)
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatePost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    )
    if (!updatePost) {
      throw Error
    }
    return updatePost
  } catch (error) {
    console.log(error)
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    )
    if (!statusCode) {
      throw Error
    }
    return { status: 'ok' }
  } catch (error) {
    console.log(error)
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    )
    return post
  } catch (error) {
    console.log(error)
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    )
    return { status: 'ok' }
  } catch (error) {
    console.log(error)
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: any = [Query.orderDesc('$updatedAt'), Query.limit(9)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()))
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

export async function seacrchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search('caption', searchTerm)]
    )
    if (!posts) throw Error
    return posts
  } catch (error) {
    console.log(error)
  }
}

export async function getAllUsers() {
  try {
    const allUsers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId
    )
    if (!allUsers) throw Error
    console.log(allUsers)

    return allUsers
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getUserPosts(userId?: string) {
  try {
    const posts = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId!
    )
    return posts
  } catch (error) {
    console.log(error)
  }
}

export function getImageUrl(imageId: string) {
  const url = storage.getFilePreview(
    appwriteConfig.storageId,
    imageId,
    2000,    // maximum width
    2000,    // maximum height
    'top',   // gravity
    100,   // quality
    undefined, // border
    undefined, // border color
    undefined  // border radius
  );
  
  return url.href;
}

export async function updateUser(profile: IUpdateUser) {
  const hasFileToUpdate = profile.file.length > 0
  try {
    let image = {
      imageUrl: profile.imageUrl,
    }
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(profile.file[0])

      if (!uploadedFile) throw Error

      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }
      image = { ...image, imageUrl: fileUrl }
    }
    console.log(profile);
    
    const updateUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      profile.userId,
      {
        name:profile.name,
        bio:profile.bio,
        imageUrl:image.imageUrl,
      }
    )

    
    if(!updateUser){
      console.log(profile);
      
      await deleteFile(profile.userId)
      throw Error
    }
    return updateUser
  } catch (error) {
    console.log(error)
  }
}
