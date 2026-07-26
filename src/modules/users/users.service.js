import bcrypt from 'bcryptjs';
import prisma from '../../config/database.js';
import sharp from 'sharp';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFilename } from '../../utils/helpers.js';
import { cloudinary, STORAGE_MODE } from '../../config/storage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AVATARS_ROOT = path.resolve(__dirname, '../../../uploads/avatars');

function formatPublicProfile(user) {
  return {
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    firstName: user.first_name,
    lastName: user.last_name,
    avatar: user.avatar,
    bio: user.bio,
    city: user.city,
    joinedAt: user.created_at,
    verified: user.identity_verified,
    rating: user.rating_avg,
    reviewCount: user.review_count,
    productCount: user.product_count,
    followerCount: user.follower_count,
  };
}

export async function getPublicProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      avatar: true,
      bio: true,
      city: true,
      district: true,
      created_at: true,
      identity_verified: true,
      rating_avg: true,
      review_count: true,
      product_count: true,
      follower_count: true,
    },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  return formatPublicProfile(user);
}

const profileFieldMap = {
  firstName: 'first_name',
  lastName: 'last_name',
  phone: 'phone',
  city: 'city',
  district: 'district',
  bio: 'bio',
};

export async function updateProfile(userId, data) {
  if (data.phone) {
    const existing = await prisma.user.findFirst({
      where: {
        phone: data.phone,
        id: { not: userId },
      },
      select: { id: true },
    });

    if (existing) {
      const error = new Error('Ce numéro de téléphone est déjà utilisé');
      error.status = 409;
      throw error;
    }
  }

  const updateData = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && profileFieldMap[key]) {
      updateData[profileFieldMap[key]] = value;
    }
  }

  if (Object.keys(updateData).length === 0) {
    const error = new Error('Aucune donnée à mettre à jour');
    error.status = 400;
    throw error;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return formatPublicProfile(user);
}

async function processAvatar(buffer) {
  return sharp(buffer)
    .resize(400, 400, { fit: 'cover' })
    .webp({ quality: 85 })
    .toBuffer();
}

async function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', format: 'webp' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function uploadAvatar(userId, file) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, avatar: true },
  });

  const buffer = await processAvatar(file.buffer);

  let avatarUrl;

  if (STORAGE_MODE === 'cloudinary') {
    const result = await uploadToCloudinary(buffer, 'tg-market/avatars');
    avatarUrl = result.secure_url;
  } else {
    const dir = path.join(AVATARS_ROOT, String(userId));
    await mkdir(dir, { recursive: true });
    const filename = `avatar_${generateFilename(file.originalname)}`;
    const filePath = path.join(dir, filename);
    await writeFile(filePath, buffer);
    avatarUrl = `http://localhost:3000/uploads/avatars/${userId}/${filename}`;

    if (user.avatar && user.avatar.includes('/uploads/avatars/')) {
      const oldRelative = user.avatar.split('/uploads/avatars/')[1];
      const oldPath = path.join(AVATARS_ROOT, oldRelative);
      await unlink(oldPath).catch(() => {});
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { avatar: avatarUrl },
  });

  return { avatar: updated.avatar, user: formatPublicProfile(updated) };
}

export async function changePassword(userId, data) {
  const { currentPassword, newPassword } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, password: true },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error('Mot de passe actuel incorrect');
    error.status = 401;
    throw error;
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: 'Mot de passe modifié avec succès' };
}

const preferencesFieldMap = {
  preferredLanguage: 'preferred_language',
  preferredCurrency: 'preferred_currency',
  notificationsEmail: 'notifications_email',
  notificationsPush: 'notifications_push',
  notificationsSms: 'notifications_sms',
};

export async function updatePreferences(userId, data) {
  const updateData = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && preferencesFieldMap[key]) {
      updateData[preferencesFieldMap[key]] = value;
    }
  }

  if (Object.keys(updateData).length === 0) {
    const error = new Error('Aucune donnée à mettre à jour');
    error.status = 400;
    throw error;
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return { message: 'Préférences mises à jour avec succès' };
}

const privacyFieldMap = {
  profileVisibility: 'profile_visibility',
  showPhone: 'show_phone',
  showLocation: 'show_location',
};

export async function updatePrivacy(userId, data) {
  const updateData = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && privacyFieldMap[key]) {
      updateData[privacyFieldMap[key]] = value;
    }
  }

  if (Object.keys(updateData).length === 0) {
    const error = new Error('Aucune donnée à mettre à jour');
    error.status = 400;
    throw error;
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return { message: 'Paramètres de confidentialité mis à jour' };
}

export async function followUser(followerId, followingId) {
  if (followerId === followingId) {
    const error = new Error('Vous ne pouvez pas vous suivre vous-même');
    error.status = 400;
    throw error;
  }

  const target = await prisma.user.findUnique({
    where: { id: followingId },
    select: { id: true, is_active: true },
  });

  if (!target || !target.is_active) {
    const error = new Error('Utilisateur introuvable ou désactivé');
    error.status = 404;
    throw error;
  }

  const existing = await prisma.follow.findUnique({
    where: {
      follower_id_following_id: {
        follower_id: followerId,
        following_id: followingId,
      },
    },
  });

  if (existing) {
    const error = new Error('Vous suivez déjà cet utilisateur');
    error.status = 409;
    throw error;
  }

  await prisma.$transaction([
    prisma.follow.create({
      data: {
        follower_id: followerId,
        following_id: followingId,
      },
    }),
    prisma.user.update({
      where: { id: followerId },
      data: { following_count: { increment: 1 } },
    }),
    prisma.user.update({
      where: { id: followingId },
      data: { follower_count: { increment: 1 } },
    }),
  ]);

  return { message: 'Utilisateur suivi avec succès' };
}

export async function unfollowUser(followerId, followingId) {
  const existing = await prisma.follow.findUnique({
    where: {
      follower_id_following_id: {
        follower_id: followerId,
        following_id: followingId,
      },
    },
  });

  if (!existing) {
    const error = new Error('Vous ne suivez pas cet utilisateur');
    error.status = 404;
    throw error;
  }

  await prisma.$transaction([
    prisma.follow.delete({
      where: {
        follower_id_following_id: {
          follower_id: followerId,
          following_id: followingId,
        },
      },
    }),
    prisma.user.update({
      where: { id: followerId },
      data: { following_count: { decrement: 1 } },
    }),
    prisma.user.update({
      where: { id: followingId },
      data: { follower_count: { decrement: 1 } },
    }),
  ]);

  return { message: 'Utilisateur désuivi avec succès' };
}

export async function getFollowers(userId, page, perPage) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  const [follows, total] = await Promise.all([
    prisma.follow.findMany({
      where: { following_id: userId },
      include: {
        follower: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar: true,
            city: true,
            identity_verified: true,
            rating_avg: true,
            product_count: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.follow.count({ where: { following_id: userId } }),
  ]);

  const users = follows.map((f) => ({
    id: f.follower.id,
    name: `${f.follower.first_name} ${f.follower.last_name}`,
    firstName: f.follower.first_name,
    lastName: f.follower.last_name,
    avatar: f.follower.avatar,
    city: f.follower.city,
    verified: f.follower.identity_verified,
    rating: f.follower.rating_avg,
    productCount: f.follower.product_count,
  }));

  return { users, total };
}

export async function getFollowing(userId, page, perPage) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  const [follows, total] = await Promise.all([
    prisma.follow.findMany({
      where: { follower_id: userId },
      include: {
        following: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar: true,
            city: true,
            identity_verified: true,
            rating_avg: true,
            product_count: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.follow.count({ where: { follower_id: userId } }),
  ]);

  const users = follows.map((f) => ({
    id: f.following.id,
    name: `${f.following.first_name} ${f.following.last_name}`,
    firstName: f.following.first_name,
    lastName: f.following.last_name,
    avatar: f.following.avatar,
    city: f.following.city,
    verified: f.following.identity_verified,
    rating: f.following.rating_avg,
    productCount: f.following.product_count,
  }));

  return { users, total };
}
