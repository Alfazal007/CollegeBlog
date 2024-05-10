import prisma from "@repo/db/client";
import { ApiResponse } from "../../../../../lib/ApiResponse";
import { ApiError } from "../../../../../lib/ApiError";
import { signUpSchema } from "@repo/zod/schema";
import bcrypt, { hash } from "bcrypt";
import { sendVerificationEmail } from "../../../../../lib/SendVerificationEmail";

export async function POST(request: Request) {
  const { username, email, password } = await request.json();
  if (!username || !email || !password) {
    return Response.json(new ApiError(400, "Incomplete data given"), {
      status: 400,
    });
  }
  const isValid = signUpSchema.safeParse({
    username,
    email,
    password,
  });
  if (!isValid.success) {
    const errors = isValid.error.issues;
    let str = "";
    errors.forEach((err) => (str += `${err.message}  `));
    return Response.json(new ApiError(400, str), {
      status: 400,
    });
  }
  const indexOfAt = email.indexOf("@");
  const tempEmail = email.substring(indexOfAt, email.length);
  const indexOfDot = tempEmail.indexOf(".");
  if (indexOfAt == -1 || indexOfDot == -1) {
    return Response.json(new ApiError(400, "Invalid email given"), {
      status: 400,
    });
  }
  const collegeName = tempEmail.substring(1, indexOfDot);
  if (collegeName.length <= 3) {
    return Response.json(
      new ApiError(400, "Invalid email given or not of a college domain"),
      {
        status: 400,
      }
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1);

  try {
    const savedCollege = await prisma.college.upsert({
      where: { name: collegeName },
      create: {
        name: collegeName,
      },
      update: {
        name: collegeName,
      },
    });
    const isUsernameTaken = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    if (isUsernameTaken) {
      return Response.json(
        new ApiError(400, "Choose different username or email or both"),
        {
          status: 400,
        }
      );
    }
    const savedUser = await prisma.user.create({
      data: {
        email: email,
        username,
        password: hashedPassword,
        college: {
          connect: {
            name: collegeName,
          },
        },
        verifyCode: randomNumber,
        isVerified: false,
        verifyCodeExpiry: expiryDate,
      },
    });
    if (!savedUser) {
      return Response.json(
        new ApiError(
          400,
          "Some error saving the user to the db try again later"
        ),
        {
          status: 400,
        }
      );
    }
    const emailSent = await sendVerificationEmail(
      email,
      username,
      randomNumber
    );
    if (emailSent.statusCode != 200) {
      return Response.json(
        new ApiError(400, "Some error with email try later"),
        {
          status: 400,
        }
      );
    }
    return Response.json(
      new ApiResponse(200, "Sign up initiated verify yourself", {}),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      new ApiError(500, "Some error on the server end"),
      {
        status: 500,
      }
    );
  }
}
